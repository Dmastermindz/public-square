import express from "express";
import { getGlobalGroupInfo, inviteUserToGlobalGroup, refreshGroupMembers, isGroupMember } from "../services/xmtpService.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

/**
 * GET /api/v1/chat/global-group
 * Get global group information
 */
router.get("/global-group", async (req, res) => {
  try {
    const groupInfo = getGlobalGroupInfo();

    res.json({
      success: true,
      data: {
        groupId: groupInfo.groupId,
        masterAddress: groupInfo.masterAddress,
        groupName: groupInfo.groupName,
        description: groupInfo.description,
        memberCount: groupInfo.memberCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting global group info:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get group information",
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/chat/request-invitation
 * Request invitation to the global group
 */
router.post(
  "/request-invitation",
  [
    // Input validation
    body("userAddress")
      .isString()
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("Invalid Ethereum address format"),
    body("groupId").isString().notEmpty().withMessage("Group ID is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { userAddress, groupId } = req.body;

      // Verify the group ID matches our global group
      const globalGroupInfo = getGlobalGroupInfo();
      if (groupId !== globalGroupInfo.groupId) {
        return res.status(400).json({
          success: false,
          error: "Invalid group ID",
          message: "The provided group ID does not match the global group",
        });
      }

      console.log(`📨 Invitation request from: ${userAddress}`);

      // Check if user is already a member
      if (isGroupMember(userAddress)) {
        return res.json({
          success: true,
          message: "User is already a member of the group",
          data: {
            groupId: globalGroupInfo.groupId,
            status: "already_member",
          },
        });
      }

      // Send invitation
      const result = await inviteUserToGlobalGroup(userAddress);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          data: {
            groupId: result.groupId || globalGroupInfo.groupId,
            status: "invitation_sent",
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        res.status(429).json({
          success: false,
          error: "Invitation cooldown",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error processing invitation request:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process invitation request",
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/v1/chat/members
 * Get group members (admin endpoint)
 */
router.get("/members", async (req, res) => {
  try {
    const members = await refreshGroupMembers();

    res.json({
      success: true,
      data: {
        members: members,
        count: members.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting group members:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get group members",
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/chat/check-membership
 * Check if a user is a member of the global group
 */
router.post(
  "/check-membership",
  [
    body("userAddress")
      .isString()
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("Invalid Ethereum address format"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { userAddress } = req.body;
      const isMember = isGroupMember(userAddress);

      res.json({
        success: true,
        data: {
          userAddress,
          isMember,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error checking membership:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check membership",
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/v1/chat/stats
 * Get chat statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const groupInfo = getGlobalGroupInfo();

    res.json({
      success: true,
      data: {
        totalMembers: groupInfo.memberCount,
        groupName: groupInfo.groupName,
        groupId: groupInfo.groupId,
        masterAddress: groupInfo.masterAddress,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting chat stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get chat statistics",
      message: error.message,
    });
  }
});

export default router;
